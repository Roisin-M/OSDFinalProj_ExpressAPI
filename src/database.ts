import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import instructor from "./models/instructor";

dotenv.config();
const connectionString : string = process.env.DB_CONN_STRING || "";
const dbName : string = process.env.DB_NAME || "yoga-studio-management"; 

const client = new MongoClient(connectionString); 

 

let db : Db  

export let instructorsCollection : Collection<instructor> 

 

export const collections: { instructors?: Collection<instructor> } = {}; 

 

client.connect().then 

(()=> 

{ 

db = client.db(dbName); 

instructorsCollection = db.collection('instructors'); 

collections.instructors = instructorsCollection; 

console.log('Connected to database'); 

} 

) 

.catch ((error) =>  

{ 

if (error instanceof Error) 
    { 

    console.log(`issue with db connection ${error.message}`); 

    } 

        else{ 

    console.log(`error with ${error}`) 

        } 

    }); 