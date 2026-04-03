import { anthropic } from "@ai-sdk/anthropic";
import { createOpenAI, openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import portfolioData from "@/data/portfolio.json";

const systemPrompt = `You are the terminal assistant for Daljeet Singh's portfolio.\nAnswer only from the data below.\nKeep answers concise, concrete, and grounded.\nAlways end with one short line suggesting 1-2 relevant terminal commands.\nNever invent facts not present in the data.\n\n${JSON.stringify(portfolioData, null, 2)}`;

function commandSuggestions(question: string): string {
  const lower = question.toLowerCase();

  if (lower.includes("project") || lower.includes("built")) {
    return "Try: projects, cd projects";
  }

  if (lower.includes("skill") || lower.includes("stack")) {
    return "Try: skills, ls ~/skills";
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("linkedin") || lower.includes("github")) {
    return "Try: contact, cd contact";
  }

  return "Try: whoami, ls";
}

function fallbackAnswer(question: string): string {
  const lower = question.toLowerCase();

  if (lower.includes("project") || lower.includes("built")) {
    const lines = portfolioData.projects.map((project) => `- ${project.name}: ${project.description}`);
    return ["Daljeet's flagship projects:", ...lines, commandSuggestions(question)].join("\n");
  }

  if (lower.includes("skill") || lower.includes("stack") || lower.includes("technology")) {
    return [
      `Languages: ${portfolioData.skills.languages.join(", ")}`,
      `Frontend: ${portfolioData.skills.frontend.join(", ")}`,
      `Backend: ${portfolioData.skills.backend.join(", ")}`,
      `Infra: ${portfolioData.skills.infra.join(", ")}`,
      commandSuggestions(question)
    ].join("\n");
  }

  if (lower.includes("contact") || lower.includes("email") || lower.includes("linkedin") || lower.includes("github")) {
    return [
      `Email: ${portfolioData.profile.email}`,
      `GitHub: ${portfolioData.profile.github.url}`,
      `LinkedIn: ${portfolioData.profile.linkedin}`,
      commandSuggestions(question)
    ].join("\n");
  }

  if (lower.includes("where") || lower.includes("location") || lower.includes("based")) {
    return [
      `${portfolioData.profile.name} is based in ${portfolioData.profile.location}.`,
      portfolioData.profile.tagline,
      commandSuggestions(question)
    ].join("\n");
  }

  return [
    portfolioData.profile.summary[0],
    portfolioData.profile.summary[1],
    commandSuggestions(question)
  ].join("\n");
}

function getModel() {
  if (process.env.GITHUB_MODELS_TOKEN) {
    const githubModels = createOpenAI({
      apiKey: process.env.GITHUB_MODELS_TOKEN,
      baseURL: "https://models.github.ai/inference"
    });

    return githubModels(process.env.GITHUB_MODEL || "gpt-4o-mini");
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest");
  }

  if (process.env.OPENAI_API_KEY) {
    if (process.env.OPENAI_BASE_URL) {
      const customOpenAI = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.OPENAI_BASE_URL
      });

      return customOpenAI(process.env.OPENAI_MODEL || "gpt-4.1-mini");
    }

    return openai(process.env.OPENAI_MODEL || "gpt-4.1-mini");
  }

  return null;
}

export async function answerPortfolioQuestion(question: string): Promise<string> {
  const model = getModel();

  if (!model) {
    return fallbackAnswer(question);
  }

  try {
    const { text } = await generateText({
      model,
      system: systemPrompt,
      prompt: question
    });

    return `${text.trim()}\n${commandSuggestions(question)}`;
  } catch {
    return fallbackAnswer(question);
  }
}