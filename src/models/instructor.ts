import {ObjectId} from "mongodb";

export default interface instructor{
    name: string;
    yogaSpecialities :YogaSpeciality[];
    email:string;
}
interface YogaSpeciality{
    type: 'Hatha' | 'Vinyasa' | 'Ashtanga' | 'Bikram' | 'Iyengar' | 'Kundalini' | 'Yin' | 'Restorative' | 'Power Yoga' | 'Jivamukti' | 'Anusara' | 'Sivananda' | 'Prenatal' | 'Aerial Yoga' | 'AcroYoga' | 'Chair Yoga' | 'Viniyoga' | 'Yoga Nidra' | 'Integral Yoga' | 'Tantra Yoga';
}