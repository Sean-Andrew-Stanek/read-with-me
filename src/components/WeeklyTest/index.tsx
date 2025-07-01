import { JSX } from 'react/jsx-runtime';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import { MoveRight } from 'lucide-react';

const WeeklyTest = (): JSX.Element => {
  return (
    <div>
        {/* Weekly Test Card */}
                    <div className="relative flex flex-col flex-1 basis-[300px] max-w-lg bg-white rounded-xl shadow-md p-4 overflow-hidden">
                        <h3 className="text-md sm:text-lg md:text-xl lg:text-2xl font-semibold text-purple-700 text-center">
                            Weekly Test
                        </h3>
                        <p className="text-gray-600 mt-2 text-xsm sm:text-sm md:text-md lg:text-xl text-center leading-loose">
                            Validate your improvements with these rewarding crafted sessions designed to help you increase your reading performances further!
                        </p>
                        <Link href="#" className="mt-auto flex justify-center">
                            <Button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm sm:text-md md:text-lg lg:text-xl flex items-center h-15">
                                {"I'm ready!"}
                                <span className="pl-3">
                                    <MoveRight />
                                </span>
                            </Button>
                        </Link>
                        <div className="absolute bottom-0 right-0 w-[60px] sm:w-[80px] md:w-[100px] lg:w-[120px] h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px]">
                            <Image
                                src="/child-reading.png"
                                alt="Child reading"
                                priority={true}
                                fill
                                sizes="(max-width: 640px) 60px, (max-width: 768px) 80px, (max-width: 1024px) 100px, 120px"
                                className="object-contain z-10"
                            />
                        </div>
                    </div>
    </div>
  )
}

export default WeeklyTest;