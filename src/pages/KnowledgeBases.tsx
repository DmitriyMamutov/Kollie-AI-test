import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Card, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useStore from "../store";

interface IFormInput {
  name: string;
}

const KnowledgeBases = () => {
  const { knowledgeBases, addKnowledgeBase } = useStore();
  const { register, handleSubmit, reset } = useForm<IFormInput>();
  const navigate = useNavigate();
  const { setCurrentPage } = useStore();

  useEffect(() => {
    setCurrentPage(1);
  }, [setCurrentPage])

  const onSubmit = (data: IFormInput) => {
    const newKnowledgeBase = {
      id: `${Date.now()}`,
      create_date: new Date(),
      total_items: 0,
      items: [],
      linked_agents: [],
      name: data.name,
    };

    addKnowledgeBase(newKnowledgeBase);
    reset();
  };

  const handleCardClick = (id: string) => {
    navigate(`/knowledge-bases/${id}`);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-center text-2xl font-bold">Knowledge Bases</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mb-6 flex gap-4">
        <div className="flex-1">
          <TextInput
            id="name"
            type="text"
            placeholder="Enter Name"
            {...register("name", { required: true })}
          />
        </div>
        <Button type="submit">Create</Button>
      </form>

      {knowledgeBases.length > 0 ? (
        <div className="space-y-4">
          {knowledgeBases.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer p-4 shadow-lg"
              onClick={() => handleCardClick(item.id)}
            >
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p><strong>Created on:</strong> {format(new Date(item.create_date), 'dd MMMM yyyy, HH:mm')}</p>
              <p><span className="font-medium">Total items:</span> {item.total_items}</p>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">Create new Knowledge base</p>
      )}
    </div>
  );
};

export default KnowledgeBases;
