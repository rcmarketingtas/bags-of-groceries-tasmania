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
}

export default function ContactConfirmationEmail({ name }: Props) {
  return (
    <Html>
      <Head />
      <Preview>
        We&apos;ve received your message — Bags of Groceries Tasmania
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={headerStyle}>
            <Heading style={headerTitle}>Bags of Groceries Tasmania</Heading>
          </Section>

          <Section style={content}>
            <Heading as="h2" style={h2}>
              Thanks for getting in touch, {name}!
            </Heading>
            <Text style={text}>
              We&apos;ve received your message and will get back to you as soon as
              possible — usually within 1–2 business days.
            </Text>
            <Text style={text}>
              In the meantime, feel free to explore our website to learn more
              about how Bags of Groceries Tasmania supports local families.
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
const divider = { borderColor: '#e5e7eb', margin: '24px 0' }
const footer = { color: '#9ca3af', fontSize: '13px', margin: 0 }
