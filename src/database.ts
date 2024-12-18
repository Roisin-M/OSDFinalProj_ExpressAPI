import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import instructor from "./models/instructor";
import ClassLocation from "./models/classLocation";
import Class from "./models/class";
import User from "./models/user";

dotenv.config();
const connectionString : string = process.env.DB_CONN_STRING || "";
const dbName : string = process.env.DB_NAME || "yoga-studio-management"; 

const client = new MongoClient(connectionString); 

 

let db : Db  

export let instructorsCollection : Collection<instructor>;
export let classLocationsCollection : Collection<ClassLocation>;
export let classesCollection : Collection<Class>;
export let usersCollection : Collection<User>;

 

export const collections: { 
    instructors?: Collection<instructor>,
    classLocations?: Collection<ClassLocation>,
    classes? : Collection<Class>,
    users? : Collection<User> } = {}; 
client.connect().then 
(()=> 
{ 
db = client.db(dbName); 
instructorsCollection = db.collection('instructors'); 
classLocationsCollection = db.collection('ClassLocations');
classesCollection = db.collection('classes');
usersCollection = db.collection('users');
collections.instructors = instructorsCollection; 
collections.classLocations = classLocationsCollection;
collections.classes = classesCollection;
collections.users = usersCollection;
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