import { siteConfig } from '@/lib/config/siteConfig';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface WelcomeEmailProps {
  title: string;
  description: string;
  links?: {
    privacy?: string;
    terms?: string;
  };
  redirect?: {
    url?: string;
    title?: string;
  };
  verificationCode?: string;
}

export function Email({
  title,
  description,
  links,
  verificationCode,
  redirect,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome</Preview>
      <Tailwind>
        <Body className='bg-offwhite font-sans text-base'>
          <Container className='mx-auto my-0 bg-[#eee] p-5'>
            <Section className='bg-white text-[#212121]'>
              <Section className='flex items-center justify-center bg-[#252f3d] px-0 py-5'>
                <Img
                  src={`${redirect?.url}/static/aws-logo.png`}
                  width='75'
                  height='45'
                  alt="AWS's Logo"
                />
              </Section>
              <Section className='px-9 py-6'>
                <Text className='mb-4 text-xl font-bold text-[#333]'>
                  {title}
                </Text>
                <Text className='mx-0 mb-3 py-3 text-sm text-[#333]'>
                  {description}
                </Text>
                {redirect?.url && (
                  <Section className='flex items-center justify-center px-9 py-5'>
                    <Text className='m-0 block w-full text-center font-bold text-[#333]'>
                      Click the button to verify
                    </Text>

                    <Button
                      className='mt-2 box-border w-full rounded bg-[#333] px-5 py-3 text-center text-xs font-semibold text-white'
                      href={redirect.url}
                    >
                      {redirect.title}
                    </Button>
                    <Text className='m-0 w-full text-center text-sm text-[#333]'>
                      (This link is valid for 10 minutes)
                    </Text>
                  </Section>
                )}
                {verificationCode && (
                  <Section className='flex items-center justify-center px-9 py-5'>
                    <Text className='m-0 text-center font-bold text-[#333]'>
                      Verification code
                    </Text>

                    <Text className='mx-0 my-3 text-center text-4xl font-semibold'>
                      {verificationCode}
                    </Text>
                    <Text className='m-0 mx-0 my-3 text-center text-sm text-[#333]'>
                      (This code is valid for 10 minutes)
                    </Text>
                  </Section>
                )}
              </Section>
              <Hr />
              <Section className='px-9 py-6'>
                <Text className='m-0 mx-0 my-3 text-sm text-[#333]'>
                  {siteConfig.name} will never email you and ask you to disclose
                  or verify your password, credit card, or banking account
                  number.
                </Text>
              </Section>
            </Section>
            <Text className='mx-0 my-3 px-5 py-0 text-xs text-[#333]'>
              This message was produced and distributed by {siteConfig.name},
              Inc.,410 kigali Ave. North, Seattle, WA 98109. © 2024,{' '}
              {siteConfig.name}, Inc.. All rights reserved. of{' '}
              <Link
                className='text-sm text-[#2754c5] underline'
                href='https://amazon.com'
                target='_blank'
              >
                {links?.terms}
              </Link>
              , Inc. View our{' '}
              <Link
                className='text-sm text-[#2754c5] underline'
                href='https://amazon.com'
                target='_blank'
              >
                {links?.privacy}
              </Link>
              .
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default Email;
