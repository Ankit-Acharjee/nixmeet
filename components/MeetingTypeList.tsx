"use client";

import { useState } from "react";
import HomeCard from "./HomeCard";
import { useRouter } from "next/navigation";
import MeetingModal from "./MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "./ui/input";

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >();

  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();
  const createMeeting = async () => {
    if (!user || !client) return;

    try {
      if (!values.dateTime) {
        toast("Please select a date and time to proceed.");
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to connect call.");
      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetails(call);

      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
      toast("Meeting successfully created");
    } catch (error) {
      console.log(error);
      toast("Failed to create meeting", {
        position: "bottom-center",
      });
    }
  };
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
      <HomeCard
        img={`/icons/add-meeting.svg`}
        title={`New Meeting`}
        description={`Start an instant meeting`}
        handleClick={() => setMeetingState("isInstantMeeting")}
        className="bg-orange-1"
      />
      <HomeCard
        img={`/icons/schedule.svg`}
        title={`Schedule Meeting`}
        description={`Plan your meeting`}
        handleClick={() => setMeetingState("isScheduleMeeting")}
        className="bg-blue-1"
      />
      <HomeCard
        img={`/icons/recordings.svg`}
        title={`View Recordings`}
        description={`Check out your recordings`}
        handleClick={() => router.push("/recordings")}
        className="bg-purple-1"
      />
      <HomeCard
        img={`/icons/join-meeting.svg`}
        title={`Join Meeting`}
        description={`via invitation link`}
        handleClick={() => setMeetingState("isJoiningMeeting")}
        className="bg-yellow-1"
      />
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create Meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="focus-visible:ring-0 focus-visible:ring-offset-0 border-none bg-dark-3"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select Date and time
            </label>
          </div>
              <ReactDatePicker 
              onChange={(date)=>setValues({...values,dateTime:date!})}
              selected={values.dateTime}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat={'MMMM d, yyyy h:mm aa'}
              className="w-full cursor-pointer rounded bg-dark-3 p-2 focus:outline-none"
              />
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting created"
          className="text-center"
          buttonText="Copy Meeting Link"
          handleClick={() => [
            navigator.clipboard.writeText(meetingLink),
            toast('Link Copied')
          ]}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={()=>router.push(values.link)}
      >
        <Input 
        placeholder="Meeting link"
        className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
        onChange={(e)=>setValues({...values, link:e.target.value})}
        /> 
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;
