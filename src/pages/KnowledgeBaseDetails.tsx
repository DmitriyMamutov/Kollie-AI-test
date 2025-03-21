import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextInput, Button, FileInput, Pagination, Select } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import useStore, { IItem } from "../store";

interface IFormInput {
  itemName: string;
  itemType: "text" | "file";
  file: File | null;
}

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
  const navigate = useNavigate();

  const { register, handleSubmit, reset, setValue, watch } = useForm<IFormInput>({
    defaultValues: {
      itemName: "",
      itemType: "text",
      file: null,
    },
  });

  useEffect(() => {
    const totalPages = Math.ceil(knowledgeBase!.items.length / itemsPerPage);

    if (knowledgeBase!.items.length <= itemsPerPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }

    if (totalPages < currentPage) {
      setCurrentPage(totalPages);
    }
  }, [knowledgeBase, currentPage, itemsPerPage, setCurrentPage]);


  if (!knowledgeBase) {
    return <p>Knowledge Base not found</p>;
  }

  const handleAddItem = (data: IFormInput) => {
    const newItem: IItem = {
      id: `${Date.now()}`,
      name: data.itemName,
      type: data.itemType,
    };

    addItemToKnowledgeBase(knowledgeBase.id, newItem);

    if (knowledgeBase.items.length <= itemsPerPage) {
      setCurrentPage(1);
    }

    reset();
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
      <Button color="gray" onClick={() => navigate("/knowledge-bases")} className="mb-4">
        Back
      </Button>
      <h1 className="text-2xl font-bold">{knowledgeBase.name}</h1>
      <div className="mt-6">
        <h2 className="mb-4 text-xl font-semibold">Add New Item</h2>

        <form onSubmit={handleSubmit(handleAddItem)}>
          <Select
            {...register("itemType")}
            className="mb-4 w-full"
          >
            <option value="text">Text</option>
            <option value="file">File Upload</option>
          </Select>

          {watch("itemType") === "text" ? (
            <TextInput
              id="item-name"
              {...register("itemName", { required: true })}
              placeholder="Enter item name"
              className="mb-4"
            />
          ) : (
            <FileInput
              id="file-input"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setValue("file", selectedFile);
                  setValue("itemName", selectedFile.name);
                }
              }}
              className="mb-4"
            />
          )}

          <Button type="submit" disabled={!watch("itemName") && !watch("file")}>
            Add Item
          </Button>
        </form>
      </div>

      <div className="mt-6 space-y-4">
        {currentItems.map((item) => (
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
        ))}
      </div>

      {knowledgeBase.items.length > itemsPerPage && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default KnowledgeBaseDetails;
