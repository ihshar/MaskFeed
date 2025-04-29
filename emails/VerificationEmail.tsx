import { Html, Head, Preview, Body, Container, Text, Heading, Button } from '@react-email/components';

interface VerificationEmailProps{
    username:string
    otp:string
}
export default function VerificationEmail({ username, otp }:VerificationEmailProps) {
  return (
    <Html lang='en'>
      <Head/>
      <Preview>Your OTP Verification Code</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', padding: '20px' }}>
        <Container style={{ maxWidth: '600px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
          <Heading style={{ color: '#333' }}>Hello, {username}!</Heading>
          <Text style={{ fontSize: '16px', color: '#555' }}>
            Use the following OTP to verify your account:
          </Text>
          <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>{otp}</Text>
          <Text style={{ fontSize: '14px', color: '#888' }}>This OTP is valid for 10 minutes.</Text>
          {/* <Button href="https://yourwebsite.com/verify" style={{ backgroundColor: '#007bff', color: '#fff', padding: '10px 20px', borderRadius: '5px', marginTop: '20px' }}>
            Verify Now
          </Button> */}
        </Container>
      </Body>
    </Html>
  );
}
