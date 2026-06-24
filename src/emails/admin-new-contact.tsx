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
  name: string
  email: string
  message: string
}

export default function AdminNewContactEmail({ name, email, message }: Props) {
  return (
    <Html>
      <Head />
      <Preview>New message from {name}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={headerStyle}>
            <Heading style={headerTitle}>New Contact Message</Heading>
          </Section>
          <Section style={content}>
            <Text style={text}>Someone sent a message through your website contact form.</Text>

            <Section style={detailBox}>
              <Text style={detailLine}><strong>Name:</strong> {name}</Text>
              <Text style={detailLine}><strong>Email:</strong> {email}</Text>
              <Text style={detailLine}><strong>Message:</strong></Text>
              <Text style={messageText}>{message}</Text>
            </Section>

            <Text style={text}>
              Reply directly to <strong>{email}</strong> to respond.
            </Text>

            <Hr style={divider} />
            <Text style={footer}>Bags of Groceries Tasmania · Admin notification</Text>
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
}
const headerStyle = { backgroundColor: '#1c4d31', padding: '24px 32px' }
const headerTitle = { color: '#ffffff', margin: 0, fontSize: '20px', fontWeight: '700' }
const content = { padding: '32px' }
const text = { color: '#374151', fontSize: '16px', lineHeight: '1.6' }
const detailBox = {
  backgroundColor: '#F4F7F5',
  border: '1px solid #D5E0DA',
  borderRadius: '8px',
  padding: '16px 20px',
  marginTop: '16px',
}
const detailLine = { color: '#374151', margin: '6px 0', fontSize: '15px', lineHeight: '1.5' }
const messageText = {
  color: '#374151',
  margin: '4px 0 0',
  fontSize: '15px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
}
const divider = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { color: '#9ca3af', fontSize: '13px', margin: 0 }
