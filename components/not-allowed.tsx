import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";


type TEmployeeNotAllowedProps = {
    cardTitle?: string | null;
    cardDescription?: string | null;
    cardContent?: string | null;
}
export default function EmployeeNotAllwoed({ cardTitle = "Access Denied", cardDescription = "You do not have permission to view this page", cardContent = "If you believe this is an error, please contact your administrator or support team." }: TEmployeeNotAllowedProps) {
    const isServer = process.env.IS_SERVER_FLAG ? true : false;
    return (
        <>
            <div className="flex items-center justify-center h-screen">
                <Card className="max-w-md w-full text-center shadow-lg border border-gray-300">
                    <CardHeader>
                        <div className="flex flex-col items-center">
                            <div className="relative z-20 flex items-center text-lg font-medium">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="mr-2 h-6 w-6"
                                >
                                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                                </svg>
                            </div>
                            <CardTitle className="text-xl font-semibold text-red-600 mt-4">
                                {cardTitle}
                            </CardTitle>
                            <CardDescription className="text-gray-600 mt-2">{cardDescription}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-500">
                            {cardContent}</p>
                    </CardContent>
                    {!isServer ? <CardFooter className='text-center justify-center'>
                        <Button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 text-white rounded hover:bg-stone-600 transition"
                        >
                            Go Back
                        </Button>
                    </CardFooter> : <></>}
                </Card>
            </div>
        </>
    )
}