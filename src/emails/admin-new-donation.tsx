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
  bags: number
  amount: number
  message?: string
  isRecurring?: boolean
}

export default function AdminNewDonationEmail({
  firstName,
  lastName,
  email,
  bags,
  amount,
  message,
  isRecurring = false,
}: Props) {
  const isContribution = bags === 0
  const recurringLabel = isRecurring ? ' (monthly)' : ''

  return (
    <Html>
      <Head />
      <Preview>
        {isContribution
          ? `New $${amount.toFixed(0)} contribution${recurringLabel} from ${firstName} ${lastName}`
          : `New donation${recurringLabel}: ${bags} bag${bags !== 1 ? 's' : ''} from ${firstName} ${lastName}`}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={headerStyle}>
            <Heading style={headerTitle}>
              New Donation{isRecurring ? ' (Monthly)' : ''}
            </Heading>
          </Section>
          <Section style={content}>
            <Text style={text}>
              {isContribution
                ? `Someone just contributed $${amount.toFixed(2)} AUD${isRecurring ? ' (monthly recurring)' : ''}. Payment confirmed via Stripe.`
                : `Someone just gave ${bags} bag${bags !== 1 ? 's' : ''} of groceries${isRecurring ? ' (monthly recurring)' : ''}. Payment confirmed via Stripe.`}
            </Text>

            <Section style={detailBox}>
              <Text style={detailLine}><strong>Donor:</strong> {firstName} {lastName}</Text>
              <Text style={detailLine}><strong>Email:</strong> {email}</Text>
              <Text style={detailLine}><strong>Amount:</strong> ${amount.toFixed(2)} AUD</Text>
              {isRecurring ? (
                <Text style={detailLine}><strong>Type:</strong> Monthly recurring</Text>
              ) : null}
              {!isContribution ? (
                <Text style={detailLine}><strong>Bags:</strong> {bags}</Text>
              ) : null}
              {message ? (
                <>
                  <Text style={detailLine}><strong>Message to family:</strong></Text>
                  <Text style={messageText}>{message}</Text>
                </>
              ) : null}
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
const messageText = {
  color: '#374151',
  margin: '4px 0 0',
  fontSize: '15px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap' as const,
}
const divider = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { color: '#9ca3af', fontSize: '13px', margin: 0 }
