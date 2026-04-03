import { Octokit } from "octokit";

import portfolioData from "@/data/portfolio.json";
import type { GitHubSnapshot } from "@/lib/commands/types";

function getOctokit(): Octokit {
  return new Octokit({ auth: process.env.GITHUB_TOKEN || undefined });
}

export async function getGitHubSnapshot(username = process.env.GITHUB_USERNAME || portfolioData.profile.github.username): Promise<GitHubSnapshot> {
  const octokit = getOctokit();

  const [{ data: user }, { data: repos }] = await Promise.all([
    octokit.request("GET /users/{username}", { username }),
    octokit.request("GET /users/{username}/repos", {
      username,
      per_page: 12,
      sort: "updated",
      direction: "desc"
    })
  ]);

  const sourceRepos = repos.filter((repo) => !repo.fork);
  const totalStars = sourceRepos.reduce((total, repo) => total + (repo.stargazers_count ?? 0), 0);

  const recentCommits = (
    await Promise.all(
      sourceRepos.slice(0, 4).map(async (repo) => {
        try {
          const { data: commits } = await octokit.request("GET /repos/{owner}/{repo}/commits", {
            owner: username,
            repo: repo.name,
            per_page: 1
          });

          return commits.map((commit) => ({
            repo: repo.name,
            message: commit.commit.message.split("\n")[0] || "No message",
            url: commit.html_url,
            committedAt: commit.commit.author?.date || repo.updated_at || new Date().toISOString()
          }));
        } catch {
          return [];
        }
      })
    )
  )
    .flat()
    .sort((left, right) => new Date(right.committedAt).getTime() - new Date(left.committedAt).getTime())
    .slice(0, 3);

  return {
    username,
    followers: user.followers ?? 0,
    publicRepos: user.public_repos ?? 0,
    totalStars,
    topRepos: sourceRepos
      .slice()
      .sort(
        (left, right) =>
          (right.stargazers_count ?? 0) - (left.stargazers_count ?? 0) ||
          (right.updated_at || "").localeCompare(left.updated_at || "")
      )
      .slice(0, 4)
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count ?? 0,
        language: repo.language ?? null,
        url: repo.html_url,
        updatedAt: repo.updated_at || new Date().toISOString()
      })),
    recentCommits
  };
}