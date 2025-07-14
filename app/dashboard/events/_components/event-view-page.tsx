'use client';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import React from 'react';
import EventForm from './event-form';

const EventViewPage = () => {
  return (
    <div>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4 p-8">
          <EventForm />
        </div>
      </ScrollArea>
    </div>
  );
};

export default EventViewPage;
