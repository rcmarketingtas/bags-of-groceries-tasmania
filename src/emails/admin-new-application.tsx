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
  lastName: string
  email: string
  phone: string
  address: string
  suburb: string
  postcode: string
  adults: number
  children: number
  circumstances: string
}

export default function AdminNewApplicationEmail({
  firstName,
  lastName,
  email,
  phone,
  address,
  suburb,
  postcode,
  adults,
  children,
  circumstances,
}: Props) {
  return (
    <Html>
      <Head />
      <Preview>New application from {firstName} {lastName}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={headerStyle}>
            <Heading style={headerTitle}>New Application</Heading>
          </Section>
          <Section style={content}>
            <Text style={text}>
              A family has applied for grocery assistance. Review it in your{' '}
              <strong>admin dashboard</strong>.
            </Text>

            <Section style={detailBox}>
              <Text style={detailLine}><strong>Name:</strong> {firstName} {lastName}</Text>
              <Text style={detailLine}><strong>Email:</strong> {email}</Text>
              <Text style={detailLine}><strong>Phone:</strong> {phone}</Text>
              <Text style={detailLine}>
                <strong>Address:</strong> {address}, {suburb} {postcode}
              </Text>
              <Text style={detailLine}>
                <strong>Household:</strong> {adults} adult{adults !== 1 ? 's' : ''}, {children} child{children !== 1 ? 'ren' : ''}
              </Text>
              <Text style={detailLine}><strong>Circumstances:</strong></Text>
              <Text style={circumstancesText}>{circumstances}</Text>
            </Section>

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
const circumstancesText = {
  color: '#374151',
  margin: '4px 0 0',
  fontSize: '15px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
}
const divider = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { color: '#9ca3af', fontSize: '13px', margin: 0 }
