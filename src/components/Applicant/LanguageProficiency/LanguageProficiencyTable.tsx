import React from "react";
import { Table, Button } from "react-bootstrap";
import { LanguageData } from "./LanguageProficiency";

interface Props {
  languages: LanguageData[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const LanguageProficiencyTable: React.FC<Props> = ({ languages, onEdit, onDelete }) => {
  return (
    <Table responsive bordered hover>
      <thead>
        <tr>
          <th>Language</th>
          <th>Speak</th>
          <th>Read</th>
          <th>Write</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {languages.map((lang) => (
          <tr key={lang.id}>
            <td>{lang.name}</td>
            <td>{lang.speaking_skill}</td>
            <td>{lang.reading_skill}</td>
            <td>{lang.writing_skill}</td>
            <td>
              <Button variant="warning" size="sm" onClick={() => onEdit(lang.id!)}>Edit</Button>{" "}
              <Button variant="danger" size="sm" onClick={() => onDelete(lang.id!)}>Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LanguageProficiencyTable;
