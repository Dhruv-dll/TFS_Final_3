import { RequestHandler } from "express";

interface SponsorItem {
  id: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  website?: string;
  isActive: boolean;
}

interface SponsorsConfig {
  sponsors: SponsorItem[];
  lastModified: number;
}

const defaultConfig: SponsorsConfig = {
  sponsors: [
    {
      id: "citizen-cooperative-bank",
      name: "Citizen Cooperative Bank",
      logo: "https://cdn.builder.io/api/v1/image/assets%2Fb448f3665916406e992f77bf5e7d711e%2Fec784fa823e24e5b9b1285f4ba0a99fb",
      industry: "Banking",
      description:
        "Cooperative banking institution dedicated to financial inclusion and community development.",
      isActive: false,
      website: "https://citizenbankdelhi.com",
    },
    {
      id: "saint-gobain",
      name: "Saint Gobain (through Mahantesh Associates)",
      logo: "https://cdn.builder.io/api/v1/image/assets%2Fb448f3665916406e992f77bf5e7d711e%2F5b52ce39d6834f09a442954d4ab0e362",
      industry: "Manufacturing",
      description:
        "Global leader in sustainable construction materials, partnering through Mahantesh Associates to enhance industry exposure.",
      isActive: false,
      website: "https://saint-gobain.com",
    },
    {
      id: "zest-global-education",
      name: "Zest Global Education",
      logo: "https://cdn.builder.io/api/v1/image/assets%2Fb448f3665916406e992f77bf5e7d711e%2F8d448a7548c345c0b5060392a99881c7",
      industry: "Education",
      description:
        "International education consultancy providing global opportunities and career guidance to students.",
      isActive: false,
      website: "https://zestglobaleducation.com",
    },
    {
      id: "iqas",
      name: "IQAS",
      logo: "https://cdn.builder.io/api/v1/image/assets%2Fb448f3665916406e992f77bf5e7d711e%2F6d57193e366e4d44b95dae677d4162dc",
      industry: "Quality Assurance",
      description:
        "Quality assurance and certification services provider supporting academic excellence standards.",
      isActive: false,
      website: "https://iqas.co.in",
    },
  ],
  lastModified: Date.now(),
};

async function loadSponsorsData(): Promise<SponsorsConfig> {
  try {
    // Fetch from GitHub instead of local file system
    const response = await fetch(
      'https://raw.githubusercontent.com/Dhruv-dll/TFS_Final_3/main/data/sponsors.json',
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      // File doesn't exist, save default config and return it
      await saveSponsorsData(defaultConfig);
      return defaultConfig;
    }
  } catch (error) {
    console.log('Error loading sponsors data, using default:', error);
    // If there's any error, save and return default
    await saveSponsorsData(defaultConfig);
    return defaultConfig;
  }
}

async function saveSponsorsData(config: SponsorsConfig): Promise<void> {
  try {
    config.lastModified = Date.now();
    const content = JSON.stringify(config, null, 2);

    // Get current file info (needed for GitHub API updates)
    const fileResponse = await fetch(
      'https://api.github.com/repos/Dhruv-dll/TFS_Final_3/contents/data/sponsors.json',
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    let sha = undefined;
    if (fileResponse.ok) {
      const fileInfo = await fileResponse.json();
      sha = fileInfo.sha;
    }

    // Update/create the file via GitHub API
    const updateResponse = await fetch(
      'https://api.github.com/repos/Dhruv-dll/TFS_Final_3/contents/data/sponsors.json',
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Update sponsors data - ${new Date().toLocaleString()}`,
          content: Buffer.from(content).toString('base64'),
          sha: sha, // Include SHA if file exists, undefined if creating new
          branch: 'main'
        })
      }
    );

    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log('Successfully committed sponsors.json to GitHub:', result.content.html_url);
    } else {
      const errorText = await updateResponse.text();
      console.error('GitHub API error for sponsors.json:', errorText);
      throw new Error('Failed to update GitHub file');
    }
  } catch (error) {
    console.error('Failed to save sponsors data:', error);
    throw error;
  }
}

export const getSponsorsData: RequestHandler = async (_req, res) => {
  try {
    const config = await loadSponsorsData();
    res.json({
      success: true,
      data: config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to load sponsors data",
        message: (error as Error).message,
      });
  }
};

export const updateSponsorsData: RequestHandler = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || !Array.isArray(data.sponsors)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid sponsors configuration" });
    }
    
    await saveSponsorsData(data);
    res.json({
      success: true,
      message: "Sponsors configuration updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to update sponsors data",
        message: (error as Error).message,
      });
  }
};

export const checkSponsorsSync: RequestHandler = async (req, res) => {
  try {
    const { lastModified } = req.query;
    const serverConfig = await loadSponsorsData();
    const clientLast = lastModified ? parseInt(lastModified as string) : 0;
    const needsUpdate = serverConfig.lastModified > clientLast;
    
    res.json({
      success: true,
      needsUpdate,
      serverLastModified: serverConfig.lastModified,
      clientLastModified: clientLast,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        error: "Failed to check sponsors sync",
        message: (error as Error).message,
      });
  }
};
