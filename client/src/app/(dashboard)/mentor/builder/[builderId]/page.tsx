import MentorshipEditor from "@/components/builder/MentorshipEditor";
import { getMentorshipTemplateAction } from "@/actions/mentor";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        builderId: string;
    }>;
}

export default async function EditMentorshipPage({ params }: PageProps) {
    const { builderId } = await params;
    const initialData = await getMentorshipTemplateAction(builderId);

    if (!initialData) {
        notFound();
    }

    return <MentorshipEditor initialData={initialData} builderId={builderId} />;
}
