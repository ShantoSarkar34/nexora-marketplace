"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    // TODO: Connect this form to your backend contact API.

    setTimeout(() => {
      setIsSubmitting(false);
    }, 800);
  }

  return (
    <Card className="border-border">
      <div>
        <h2 className="text-text-primary text-xl font-semibold">
          Send us a message
        </h2>

        <p className="text-text-secondary mt-1 text-sm">
          Fill out the form and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Your name</Label>

            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="email">Email address</Label>

            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>

          <Input
            id="subject"
            name="subject"
            placeholder="How can we help?"
            required
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>

          <Textarea
            id="message"
            name="message"
            rows={6}
            placeholder="Tell us how we can help you..."
            required
            className="mt-2"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          {!isSubmitting && <Send className="mr-2 h-4 w-4" />}
          Send message
        </Button>
      </form>
    </Card>
  );
}
