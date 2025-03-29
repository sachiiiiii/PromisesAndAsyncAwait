// Importing database functions. DO NOT MODIFY THIS LINE.
import { central, db1, db2, db3, vault } from "./databases.mjs";

function getUserData(id) {
  const dbs = {
    db1: db1,
    db2: db2,
    db3: db3
  };
}

/**
 * Part 1: The Scenario
 * 
 * You are a developer in a very large corporation that splits its data across multiple databases. 
 * Your job is to assemble this information using a single function that takes an id parameter 
 * and returns a Promise that resolves to an object containing specific data.
 * 
 * Databases:
 * central: identifies which database the users are stored within
 * ~ returns a string that identifies the database for that particular user's info. 
 * ~ You can access the central database like so:
 const returnedValue = await central(id);
 OR
 central(id).then((returnedValue) => { ... });
 * there are only ten unique user values, so test the function using id values between 1 and 10 (inclusive).
 * Use values outside of this range to test for error cases.
 * 
 * db1, db2, and db3: contain the user's basic information, including username, website, and company. 
 * ~ return an object with basic info as properties.
 * ~ return a rejected Promise indicating which database failed, if one them has an error
 * ~ You can access these databases like so:
const returnedValue = await db1(id);
OR
db1(id).then((returnedValue) => { ... });
* Using the dbs object, you can access each database directly using the string returned from 
* central by using square bracket notation, e.g.:
dbs[valueReturnedFromCentral](id)
* This can help circumvent some conditional logic that would otherwise be required.
* vault: The personal data for each user is contained within the vault database 
* since its access and usage is restricted by law. The vault will return an object 
* with the user's name, email, address, and phone, and can be accessed like so:
const returnedValue = await vault(id);
OR
vault(id).then((returnedValue) => { ... });
*/

async function getUsersData(id) {
  // check the type and range of the id parameter. 
  // If it's not a number or is outside the valid range, rejects the Promise with an appropriate error message.
  if (typeof id !== "number") {
    return Promise.reject(new Error("Invalid Input -- Not a Number"));
  }
  if (id < 1 || id > 10) {
    return Promise.reject(new Error("Invalid Input -- Out of Range"));
  }

  // Implement a try...catch block to catch any errors that may occur while making the database requests.
  try {
    const dbName = await central(id); // call central() to determine which database (db1, db2, or db3) contains the user's basic info
    // Use Promise.all to query the appropriate database (determined by dbName) and the vault database concurrently.
    const [dbData, vaultData] = await Promise.all([
      // I consulted Google for the compound ternary operator
      (dbName === "db1" ? db1(id) : dbName === "db2" ? db2(id) : db3(id)), 
      vault(id),
    ]);

    // Once both Promises resolve, put the user's data together into the specified object format.
    return {
      id: id,
      name: vaultData.name,
      username: dbData.username,
      email: vaultData.email,
      address: vaultData.address,
      phone: vaultData.phone,
      website: dbData.website,
      company: dbData.company,
    }
  } catch (error) {
    return Promise.rject(error);
  }
}

// Test cases
/**
 * Psss in different values for id, including:
 * Valid numbers – 1 through 10 (inclusive).
 * Invalid numbers – less than 1 or higher than 10.
 * Invalid data types – strings, Booleans, etc.
 */
// Iterate through several test cases and logs the results to the console.
async function testUserData() {
  const testIds = [1, 4, 8, 0, 10, 19, "string", false, true, null, undefined, NaN];

  for (const id of testIds) {
    try {
      const userData = await getUserData(id);
      console.log(`User data for id=${id}: `, userData);
    } catch (error) {
      console.log(`Error for id ${id}: `, error.message);
    }
  }
}

testUserData();