import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, LoggerModule, HealthModule, AUTH_PACKAGE_NAME, PAYMENTS_PACKAGE_NAME, AUTH_SERVICE_NAME, PAYMENTS_SERVICE_NAME } from '@app/common';
import { ReservationsRepository } from './reservations.repository';
import { Reservation } from './models/reservation.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Reservation]),
    LoggerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: AUTH_PACKAGE_NAME,
            protoPath: join(__dirname, '../../proto/auth.proto'),
            url: configService.getOrThrow('AUTH_GRPC_URL')
          }
        }),
        inject: [ConfigService]
      },
      {
        name: PAYMENTS_SERVICE_NAME,
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: PAYMENTS_PACKAGE_NAME,
            protoPath: join(__dirname, '../../proto/payments.proto'),
            url: configService.getOrThrow('PAYMENTS_GRPC_URL')
          }
        }),
        inject: [ConfigService]
      }
    ]),
    HealthModule
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService, ReservationsRepository],
})
export class ReservationsModule { }
