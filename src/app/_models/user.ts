import { Gender } from './gender';

export class User {
    id!: string;
    rollNo!: string;
    name!: string;
    age!: string;
    email!: string;
    std! : string;
    gender!: Gender;
    profileUrl!:string;
    isDeleting: boolean = false;
    parents:Array<Parent>;
}

export interface Parent{
    parentStreet: Parent;
    parentState: Parent;
    parentCity: Parent;
    parentZipCode: Parent;
    parentAddress: ParentAddress
    parentAge: number
    parentEmail: string
    parentGender: string
    parentName: string
    parentProfileUrl:string
    relation: string
}

export interface ParentAddress {
    parentStreet: string, 
    parentState: string, 
    parentCity: string, 
    parentZipCode: string
}