// In-memory storage for generations (replace with database later)
// This is temporary storage just for development
const generations = new Map<
  string,
  {
    id: string;
    type: string;
    tone: string;
    input: Record<string, string>;
    output: string;
    createdAt: Date;
    model?: string;
  }
>();

export function saveGeneration(
  id: string,
  type: string,
  tone: string,
  input: Record<string, string>,
  output: string,
  model?: string
) {
  generations.set(id, {
    id,
    type,
    tone,
    input,
    output,
    createdAt: new Date(),
    model,
  });
  return generations.get(id);
}

export function getGeneration(id: string) {
  return generations.get(id) || null;
}

export function getAllGenerations() {
  return Array.from(generations.values()).sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

export function getGenerationsByType(type: string) {
  return Array.from(generations.values())
    .filter((gen) => gen.type === type)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function deleteGeneration(id: string) {
  return generations.delete(id);
}

export function clearAllGenerations() {
  generations.clear();
}
