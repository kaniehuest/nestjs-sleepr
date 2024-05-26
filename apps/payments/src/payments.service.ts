import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { NOTIFICATIONS_SERVICE_NAME, NotificationsServiceClient } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService  {
  private notificationsService: NotificationsServiceClient

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: "2024-04-10"
    }
  )

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME) private readonly client: ClientGrpc
  ) { }

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      confirm: true,
      currency: 'usd',
      payment_method: 'pm_card_visa',
      return_url: "https://google.com"
    })

    if (!this.notificationsService) {
      this.notificationsService = this.client.getService<NotificationsServiceClient>(NOTIFICATIONS_SERVICE_NAME)
    }

    this.notificationsService
    .notifyEmail({ 
      email, 
      text: `Your payment of $${amount} has completed successfully` 
    })
    .subscribe(() => {})

    return paymentIntent
  }
}
