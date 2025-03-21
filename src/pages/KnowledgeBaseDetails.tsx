import { ChangeEvent, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TextInput, Button, FileInput, Pagination, Select } from "flowbite-react";
import useStore, { Item } from "../store";

const KnowledgeBaseDetails = () => {
  const { knowledgeBaseId } = useParams();
  const {
    knowledgeBases,
    addItemToKnowledgeBase,
    deleteItemFromKnowledgeBase,
    currentPage,
    itemsPerPage,
    setCurrentPage,
  } = useStore();
  const knowledgeBase = knowledgeBases.find((kb) => kb.id === knowledgeBaseId);
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState<"text" | "file">("text");
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (knowledgeBase!.items.length <= itemsPerPage && currentPage > 1) {
      setCurrentPage(1);
    }
  }, [currentPage, itemsPerPage, knowledgeBase, setCurrentPage]);

  if (!knowledgeBase) {
    return <p>Knowledge Base not found</p>;
  }

  const handleItemNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setItemName(event.target.value);
  };

  const handleItemTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setItemType(event.target.value as "text" | "file");
    setFile(null);
    setItemName("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setItemName(selectedFile.name);
    }
  };

  const handleAddItem = () => {
    const newItem: Item = {
      id: `${Date.now()}`,
      name: itemName,
      type: itemType,
    };

    addItemToKnowledgeBase(knowledgeBase.id, newItem);

    setItemName("");
    setFile(null);
  };

  const handleDeleteItem = (itemId: string) => {
    deleteItemFromKnowledgeBase(knowledgeBase.id, itemId);
  };

  const totalPages = Math.ceil(knowledgeBase.items.length / itemsPerPage);

  const currentItems = knowledgeBase.items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <Button
        color="gray"
        onClick={() => navigate("/knowledge-bases")} className="mb-4">
        Back
      </Button>
      <h1 className="text-2xl font-bold">{knowledgeBase.name}</h1>
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold">Add New Item</h2>

        <Select
          value={itemType}
          onChange={handleItemTypeChange}
          className="mb-4 w-full "
        >
          <option value="text">Text</option>
          <option value="file">File Upload</option>
        </Select>

        {itemType === "text" ? (
          <TextInput
            id="item-name"
            value={itemName}
            onChange={handleItemNameChange}
            placeholder="Enter item name"
            className="mb-4"
          />
        ) : (
          <FileInput
            id="file-input"
            onChange={handleFileChange}
            className="mb-4"
          />
        )}

        <Button onClick={handleAddItem} disabled={!itemName && !file}>
          Add Item
        </Button>
      </div>

      <div className="mt-6 space-y-4">{currentItems?.map((item) => (
        <div key={item.id} className="flex items-center justify-between rounded-md border p-4 shadow-md">
          <div>
            <h3 className="text-xl font-semibold">{item.name}</h3>
            <p><strong>Type:</strong> {item.type}</p>
          </div>

          <Button
            color="failure"
            onClick={() => handleDeleteItem(item.id)}
            className="ml-4"
          >
            Delete Item
          </Button>
        </div>
      ))
      }
      </div>

      {knowledgeBase.items.length > itemsPerPage &&
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      }
    </div>
  );
};

export default KnowledgeBaseDetails;
