import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Section,
  Preview,
} from '@react-email/components'

interface Props {
  firstName: string
}

export default function ApplicationConfirmationEmail({ firstName }: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        Your application has been received — Bags of Groceries Tasmania
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={headerStyle}>
            <Heading style={headerTitle}>Bags of Groceries Tasmania</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Application Received, {firstName}
            </Heading>
            <Text style={text}>
              Thank you for reaching out. Your application for grocery
              assistance has been received and is currently under review.
            </Text>

            <Section style={infoBox}>
              <Text style={infoTitle}>What happens next?</Text>
              <Text style={infoText}>
                Our team will review your application and be in touch within
                3–5 business days. Please ensure you are available on the
                contact details you provided.
              </Text>
            </Section>

            <Text style={text}>
              If you have any questions in the meantime, please don't hesitate
              to contact us.
            </Text>

            <Hr style={divider} />

            <Text style={footer}>
              Bags of Groceries Tasmania · Supporting Tasmanian families
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body = { backgroundColor: '#f4f4f5', fontFamily: 'sans-serif' }
const container = {
  maxWidth: '600px',
  margin: '40px auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
}
const headerStyle = { backgroundColor: '#2E7D32', padding: '28px 32px' }
const headerTitle = {
  color: '#ffffff',
  margin: 0,
  fontSize: '22px',
  fontWeight: '700',
}
const content = { padding: '32px' }
const h2 = { color: '#2E7D32', fontSize: '20px', marginTop: 0 }
const text = { color: '#374151', fontSize: '16px', lineHeight: '1.6' }
const infoBox = {
  backgroundColor: '#FFF7ED',
  border: '1px solid #FED7AA',
  borderRadius: '8px',
  padding: '16px 20px',
  marginTop: '20px',
  marginBottom: '20px',
}
const infoTitle = {
  color: '#92400E',
  fontWeight: '700',
  margin: '0 0 8px',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}
const infoText = { color: '#374151', margin: 0, fontSize: '15px', lineHeight: '1.6' }
const divider = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { color: '#9ca3af', fontSize: '13px', margin: 0 }
