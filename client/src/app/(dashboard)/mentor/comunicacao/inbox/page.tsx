import { InboxCentral } from "@/components/shared/chat/InboxCentral";

export default function MentorInboxPage() {
    // Em um cenário real, o ID viria da sessão do usuário logado
    const mentorId = "mentor_01";

    return (
        <InboxCentral
            userRole="MENTOR"
            userId={mentorId}
        />
    );
}