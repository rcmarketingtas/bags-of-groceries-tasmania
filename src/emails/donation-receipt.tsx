'use client'

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
  bags: number
  amount: number
  isRecurring?: boolean
}

export default function DonationReceiptEmail({
  firstName,
  bags,
  amount,
  isRecurring = false,
}: Props) {
  const isContribution = bags === 0

  return (
    <Html>
      <Head />
      <Preview>
        {isRecurring
          ? isContribution
            ? `Thank you for your monthly $${amount.toFixed(0)} gift — Bags of Groceries Tasmania`
            : `Thank you for your monthly gift — Bags of Groceries Tasmania`
          : isContribution
            ? `Thank you for your $${amount.toFixed(0)} contribution — Bags of Groceries Tasmania`
            : `Thank you for sponsoring ${bags} grocery bag${bags > 1 ? 's' : ''} — Bags of Groceries Tasmania`}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headerTitle}>Bags of Groceries Tasmania</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Thank you, {firstName}!
            </Heading>
            <Text style={text}>
              {isContribution ? (
                <>
                  Your generous{' '}
                  {isRecurring ? 'monthly ' : null}
                  <strong>${amount.toFixed(2)} AUD</strong>{' '}
                  {isRecurring ? 'gift has been received' : 'contribution has been received'}.
                  It helps us keep supporting Tasmanian families through Bags of Groceries.
                </>
              ) : (
                <>
                  Your generous {isRecurring ? 'monthly ' : null}donation has been received
                  and processed. You have sponsored{' '}
                  <strong>
                    {bags} grocery bag{bags > 1 ? 's' : ''}
                  </strong>{' '}
                  for a Tasmanian family in need
                  {isRecurring ? ' this month' : null}.
                </>
              )}
            </Text>

            <Section style={summaryBox}>
              <Text style={summaryTitle}>Donation Summary</Text>
              <Text style={summaryLine}>
                Amount paid: <strong>${amount.toFixed(2)} AUD</strong>
                {isRecurring ? ' (monthly)' : null}
              </Text>
              {!isContribution ? (
                <Text style={summaryLine}>
                  Bags sponsored: <strong>{bags}</strong>
                </Text>
              ) : null}
            </Section>

            <Text style={text}>
              Your support makes a real, tangible difference to Tasmanian
              families experiencing hardship.
              {!isContribution
                ? ' Groceries will be prepared and delivered by our supermarket partner.'
                : null}
              {isRecurring
                ? ' You can manage or cancel your subscription through Stripe at any time.'
                : null}
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
const header = {
  backgroundColor: '#2E7D32',
  padding: '28px 32px',
}
const headerTitle = {
  color: '#ffffff',
  margin: 0,
  fontSize: '22px',
  fontWeight: '700',
}
const content = { padding: '32px' }
const h2 = { color: '#2E7D32', fontSize: '20px', marginTop: 0 }
const text = { color: '#374151', fontSize: '16px', lineHeight: '1.6' }
const summaryBox = {
  backgroundColor: '#F0FDF4',
  border: '1px solid #BBF7D0',
  borderRadius: '8px',
  padding: '16px 20px',
  marginTop: '20px',
  marginBottom: '20px',
}
const summaryTitle = {
  color: '#166534',
  fontWeight: '700',
  margin: '0 0 8px',
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}
const summaryLine = { color: '#374151', margin: '4px 0', fontSize: '15px' }
const divider = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { color: '#9ca3af', fontSize: '13px', margin: 0 }
