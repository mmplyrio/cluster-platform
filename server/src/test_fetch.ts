import { MentorService } from './services/mentor.service';

async function testFetch() {
  try {
    const data = await MentorService.getAlunoDetails("c0d4c2bb-2098-4ee0-9c17-35e3ba5a844b", "5615dc40-cfc4-4180-8e24-c3036fed42c2");
    console.log("Success!", data);
  } catch(e) {
    console.error("Error:", e);
  }
}
testFetch();
