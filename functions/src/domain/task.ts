export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: FirebaseFirestore.Timestamp;
  updatedAt?: FirebaseFirestore.Timestamp;
};
