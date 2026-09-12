'use client';

import {useId, useRef, useState, type FormEvent} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {TextInput} from '@astryxdesign/core/TextInput';
import {TextArea} from '@astryxdesign/core/TextArea';
import {Selector} from '@astryxdesign/core/Selector';
import {FieldStatus} from '@astryxdesign/core/FieldStatus';

/**
 * Contact form (§2.3, §4.7). Netlify Forms only — same-origin POST.
 * Defences in depth:
 *  1. honeypot field (visually hidden, aria-hidden, tabindex -1)
 *  2. time-trap: reject submissions completed in under 2 s
 *  3. Netlify's own spam filtering (enabled in the Netlify UI)
 *  4. client-side debounce on submit — a UX affordance, NOT a security control
 *     (stated honestly in docs/ARCHITECTURE.md)
 *
 * Astryx form primitives carry behaviour (focus, ARIA, states) but not the
 * HTML `name` attribute, so hidden named inputs mirror the React state — this
 * is what Netlify's build bot registers as form fields. For no-JS clients,
 * a <noscript> fallback (copy from content/site-content.md) explains options.
 *
 * All strings below are copied verbatim from content/site-content.md.
 */
const COPY = {
  errors: {
    name: 'Please tell us your name.',
    email: 'Please enter a valid email address.',
    message: 'Please write a short message.',
  },
  timeTrap: 'That was too quick for a human — please try again.',
  failure: 'Something went wrong sending your message. Please try again.',
  sending: 'Sending…',
  noJs: 'This form needs JavaScript. Prefer post? Write to us: Singbulli Road, Darjeeling district, West Bengal, India.',
};

const TOPICS = [
  {value: 'General question', label: 'General question'},
  {value: 'Wholesale', label: 'Wholesale'},
  {value: 'Press', label: 'Press'},
  {value: 'Visit the garden', label: 'Visit the garden'},
];

type Errors = {name?: string; email?: string; message?: string};

export function ContactForm() {
  const uid = useId();
  const openedAt = useRef<number>(Date.now());
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<string>(TOPICS[0].value);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const lastSubmit = useRef<number>(0);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!name.trim()) next.name = COPY.errors.name;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = COPY.errors.email;
    if (!message.trim()) next.message = COPY.errors.message;
    return next;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    // Time-trap (§2.3): humans need a moment; bots do not.
    if (Date.now() - openedAt.current < 2000) {
      setFormError(COPY.timeTrap);
      return;
    }

    // Debounce: a UX affordance only — a direct POST bypasses it trivially.
    const now = Date.now();
    if (now - lastSubmit.current < 1500) return;
    lastSubmit.current = now;

    setSubmitting(true);
    try {
      const body = new URLSearchParams({
        'form-name': 'contact',
        name,
        email,
        topic,
        message,
      });
      const res = await fetch('/', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: body.toString(),
      });
      if (!res.ok) throw new Error('send failed');
      window.location.assign('/thank-you/');
    } catch {
      setFormError(COPY.failure);
      setSubmitting(false);
    }
  };

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="company"
      action="/thank-you/"
      onSubmit={onSubmit}
      noValidate
    >
      {/* Static form declaration so Netlify's build bot registers the fields */}
      <input type="hidden" name="form-name" value="contact" />
      <p className="honeypot-field" aria-hidden="true">
        <label>
          Don't fill this out if you're human:{' '}
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      {/* Named mirrors of the controlled Astryx fields (Netlify registration) */}
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="topic" value={topic} />
      <input type="hidden" name="message" value={message} />

      <TextInput
        label="Name"
        type="text"
        value={name}
        onChange={v => {
          setName(v);
          if (errors.name) setErrors(e => ({...e, name: undefined}));
        }}
      />
      {errors.name && <FieldStatus type="error" message={errors.name} id={`${uid}-name`} variant="detached" />}

      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={v => {
          setEmail(v);
          if (errors.email) setErrors(e => ({...e, email: undefined}));
        }}
      />
      {errors.email && <FieldStatus type="error" message={errors.email} id={`${uid}-email`} variant="detached" />}

      <Selector label="Topic" options={TOPICS} value={topic} onChange={setTopic} />

      <TextArea
        label="Message"
        value={message}
        onChange={v => {
          setMessage(v);
          if (errors.message) setErrors(e => ({...e, message: undefined}));
        }}
      />
      {errors.message && <FieldStatus type="error" message={errors.message} id={`${uid}-message`} variant="detached" />}

      <div aria-live="polite">
        {formError && <FieldStatus type="error" message={formError} id={`${uid}-form`} variant="detached" />}
      </div>

      <Button type="submit" label={submitting ? COPY.sending : 'Send message'} variant="primary" isDisabled={submitting} />

      <noscript>
        <p>{COPY.noJs}</p>
      </noscript>
    </form>
  );
}
