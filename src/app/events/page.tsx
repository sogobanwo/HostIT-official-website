import EventsHero from '@/components/events/EventsHero'
import OngoingEvents from '@/components/events/OngoingEvents'
import React from 'react'

type Props = {}

const page = (props: Props) => {
  return (
    <>
    <EventsHero />
    <OngoingEvents />
    </>
  )
}

export default page