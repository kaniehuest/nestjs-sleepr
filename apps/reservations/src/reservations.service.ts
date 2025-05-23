import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { map } from 'rxjs';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE_NAME, PaymentsServiceClient, User } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService implements OnModuleInit {
  private paymentsService: PaymentsServiceClient

  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE_NAME) private readonly client: ClientGrpc
  ) { }

  onModuleInit() {
    this.paymentsService = this.client.getService<PaymentsServiceClient>(PAYMENTS_SERVICE_NAME)
  }

  async create(
    createReservationDto: CreateReservationDto, 
    { email, id: userId }: User
  ) {
    return this.paymentsService
      .createCharge({
        ...createReservationDto.charge,
        email,
      })
      .pipe(
        map((res) => {
          const reservation = new Reservation({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId,
          })
          return this.reservationsRepository.create(reservation)
        })
      )
  }

  async findAll() {
    return this.reservationsRepository.find({})
  }

  async findOne(id: number) {
    return this.reservationsRepository.findOne({ id })
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      updateReservationDto
    )
  }

  async remove(id: number) {
    return this.reservationsRepository.findOneAndDelete({ id })
  }
}
