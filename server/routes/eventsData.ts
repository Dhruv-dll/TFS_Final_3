import { RequestHandler } from "express";

// Define the events data structure
interface EventItem {
  title: string;
  description?: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  registrationLink: string;
  countdown: {
    days: number;
    hours: number;
    minutes: number;
  };
}

interface EventsConfig {
  pastEvents: {
    [key: string]: {
      events?: EventItem[];
      comingSoon?: boolean;
    };
  };
  upcomingEvents: UpcomingEvent[];
  lastModified: number;
}

// Default events configuration - KEEPING ALL YOUR EXISTING DATA
const defaultConfig: EventsConfig = {
  pastEvents: {
    "saturday-sessions": {
      events: [
        {
          title: "Saturday Seminar 1: Data Meets Finance",
          description:
            "Exploring the intersection of data analytics and financial decision-making",
        },
        {
          title:
            "Saturday Seminar 2: Banking 101: Demystifying India's Backbone",
          description:
            "Understanding the fundamentals of India's banking system",
        },
      ],
    },
    "networking-events": {
      comingSoon: true,
    },
    "flagship-event": {
      comingSoon: true,
    },
  },
  upcomingEvents: [],
  lastModified: Date.now(),
};

// Load events data from GitHub instead of local file system
async function loadEventsData(): Promise<EventsConfig> {
  try {
    console.log("🔍 Loading events data from GitHub...");
    
    // Fetch from GitHub raw URL
    const response = await fetch(
      'https://raw.githubusercontent.com/Dhruv-dll/TFS_Final_3/main/data/events.json',
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Successfully loaded events data from GitHub");
      return data;
    } else {
      // File doesn't exist, create it with default config
      console.log("📝 No existing events data found, creating with defaults");
      await saveEventsData(defaultConfig);
      return defaultConfig;
    }
  } catch (error) {
    console.log("⚠️ Error loading events data, using defaults:", error.message);
    // If there's any error, save and return default
    await saveEventsData(defaultConfig);
    return defaultConfig;
  }
}

// Save events data to GitHub via API
async function saveEventsData(config: EventsConfig): Promise<void> {
  try {
    config.lastModified = Date.now();
    const content = JSON.stringify(config, null, 2);

    console.log("💾 Saving events data to GitHub...");

    // Get current file info (needed for GitHub API updates)
    const fileResponse = await fetch(
      'https://api.github.com/repos/Dhruv-dll/TFS_Final_3/contents/data/events.json',
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
      'https://api.github.com/repos/Dhruv-dll/TFS_Final_3/contents/data/events.json',
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
          message: `Update events data - ${new Date().toLocaleString()}`,
          content: Buffer.from(content).toString('base64'),
          sha: sha, // Include SHA if file exists, undefined if creating new
          branch: 'main'
        })
      }
    );

    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log("✅ Successfully committed events.json to GitHub:", result.content.html_url);
    } else {
      const errorText = await updateResponse.text();
      console.error("❌ GitHub API error for events.json:", errorText);
      throw new Error('Failed to update GitHub file');
    }
  } catch (error) {
    console.error("❌ Failed to save events data:", error);
    throw error;
  }
}

// GET /api/events - Retrieve events configuration
export const getEventsData: RequestHandler = async (req, res) => {
  try {
    const config = await loadEventsData();
    res.json({
      success: true,
      data: config,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error loading events data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load events data",
      message: error.message,
    });
  }
};

// POST /api/events - Update events configuration
export const updateEventsData: RequestHandler = async (req, res) => {
  try {
    const { data: newConfig } = req.body;
    
    if (!newConfig || typeof newConfig !== "object") {
      return res.status(400).json({
        success: false,
        error: "Invalid events configuration data",
      });
    }

    // Validate required structure
    if (!newConfig.pastEvents || !Array.isArray(newConfig.upcomingEvents)) {
      return res.status(400).json({
        success: false,
        error: "Invalid events configuration structure",
      });
    }

    await saveEventsData(newConfig);
    
    res.json({
      success: true,
      message: "Events configuration updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating events data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update events data",
      message: error.message,
    });
  }
};

// GET /api/events/sync - Check if local data is outdated
export const checkEventsSync: RequestHandler = async (req, res) => {
  try {
    const { lastModified } = req.query;
    const serverConfig = await loadEventsData();
    const clientLastModified = lastModified
      ? parseInt(lastModified as string)
      : 0;
    const needsUpdate = serverConfig.lastModified > clientLastModified;

    res.json({
      success: true,
      needsUpdate,
      serverLastModified: serverConfig.lastModified,
      clientLastModified,
    });
  } catch (error) {
    console.error("Error checking events sync:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check events sync",
      message: error.message,
    });
  }
};
