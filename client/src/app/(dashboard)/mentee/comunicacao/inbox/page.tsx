import { InboxCentral } from "@/components/shared/chat/InboxCentral";

export default function MenteeInboxPage() {
    const alunoId = "aluno_01"; // Mock ID do aluno

    return (
        <InboxCentral
            userRole="ALUNO"
            userId={alunoId}
        />
    );
}
