import { json, redirect } from "@remix-run/node";
import NewNote, { links as newNoteLinks } from "../components/NewNote";
import NoteList, { links as noteListLinks } from "../components/NoteList";
import { getStoredNotes, storeNotes } from "../data/notes";
import { useLoaderData } from "@remix-run/react";

export default function NotesPage() {
  const notes = useLoaderData();

  return (
    <>
      <main>
        <NewNote />
        <NoteList notes={notes} />
      </main>
    </>
  );
}

//Backend code for get requests
export async function loader() {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes." },
      {
        status: 404,
      }
    );
  }
  return notes;
}

//Backend code
export async function action({ request }) {
  const formData = await request.formData();
  // const noteData = {
  //     title: formData.get('title'),
  //     content: formData.get('content')
  // }
  const noteData = Object.fromEntries(formData);
  if (noteData.title.trim().length < 5) {
    return { message: "Invalid title - must be atleast 5 characters long." };
  }
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();

  const updatedNotes = existingNotes.concat(noteData);

  await storeNotes(updatedNotes);

  return redirect("/notes");
}

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export function CatchBoundary() {}
