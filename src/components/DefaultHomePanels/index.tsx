import { JSX } from "react";
import WeeklyTest from "../WeeklyTest";
import SurveyCard from "../SurveyCard";
import ReadStoryPan from "./ReadStoryPan";
import ChallengesPan from "./ChallengesPan";

type DefaultHomePanelsProps = {
    randomStoryId: string | null;
    setReadOpen: (value: boolean) => void;
    setChallengesOpen: (value: boolean) => void;
}

const DefaultHomePanels = ({
    randomStoryId,
    setReadOpen,
    setChallengesOpen,
}: DefaultHomePanelsProps): JSX.Element => {


    return (
        <>
            <div className="flex flex-col space-y-4 p-4 sm:p-8 md:p-16 bg-gray-100 rounded-[2rem] shadow-md w-full my-0">
                {/* Read a Story */}
                <ReadStoryPan
                    randomStoryId={randomStoryId}
                    setReadOpen={setReadOpen}
                />

                {/* Challenges */}
                <ChallengesPan 
                    randomStoryId={randomStoryId}
                    setChallengesOpen={setChallengesOpen}
                />
                
                {/* Text Panels */}
                <div className="mt-6 flex flex-wrap justify-center gap-6 sm:gap-8 p-0">
                    <WeeklyTest />
                    <SurveyCard />
                </div>
            </div>
        </>
    )
}

export default DefaultHomePanels