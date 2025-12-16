import { getWeather } from "./weather";

export const toolDefinitions = [
    {
      type: "function",
      function: {
        name: "getWeather",
        description: "Get weather conditions for a given city name.",
        parameters: {
          type: "object",
          properties: {
            location: {
              type: "string",
              description: "City name such as 'Berlin', 'London', etc."
            }
          },
          required: ["location"]
        }
      }
    }
  ];

export const toolImplementations = {
    getWeather: async ({ location }: { location: string }) => {
      return await getWeather(location);
    }
};