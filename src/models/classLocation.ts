import {ObjectId} from "mongodb";

export enum ClassFormat{
    Location = 'Location', //classes held only at physical location
    Stream = 'Stream', // classes held only online via live stream
    Both = 'Both' // classes available both online and at the location
}

export default interface ClassLocation{
    id? :ObjectId;
    name: string;
    maxCapacity: number;
    location: string;
    classFormats: ClassFormat[];
}