import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export default class Highscore {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type:"integer",nullable:false})
    score: number;

    @Column({type:"text", nullable:false})
    test:string;

}


