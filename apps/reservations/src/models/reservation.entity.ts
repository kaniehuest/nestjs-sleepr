import { AbstractEntity } from "@app/common";
import { Column, Entity } from "typeorm";

@Entity()
export class Reservation extends AbstractEntity<Reservation> {
    @Column()
    timestamp: Date;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column({ default: 1 })
    userId: number;

    @Column()
    invoiceId: string
}
