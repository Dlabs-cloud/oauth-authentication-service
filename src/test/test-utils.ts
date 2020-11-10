import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ServiceImplModule } from '../service-impl/service-impl.module';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

export const mockSendEmail = () => jest.fn().mockImplementation((sendEmailOptions: ISendMailOptions) => {
  return Promise.resolve('Email has been sent successfully');
});

export function baseTestingModule() {
  return Test.createTestingModule({
    imports: [AppModule, ServiceImplModule],
    providers: [],
  }).overrideProvider(MailerService)
    .useValue({
      sendMail: mockSendEmail(),
    });
}