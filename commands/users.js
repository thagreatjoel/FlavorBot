import fetch from "node-fetch";

export default function usersCommand(app) {
  app.command("/users", async ({ ack, respond, command }) => {
    await ack();

    const query = command.text.trim();
    if (!query) {
      return respond("You probably forgot the name.\nUsage: `/user <name>`");
    }

    try {
      const res = await fetch("https://flavortown.hackclub.com/api/v1/users", {
        headers: {
          Authorization: `Bearer ${process.env.FLAVOR_API}`,
          "User-Agent": "FlavorBot/1.0",
          Accept: "application/json",
        },
      });

      if (!res.ok) {
        return respond("⚠️ API error");
      }

      const data = await res.json();
      if (!Array.isArray(data.users)) {
        return respond("⚠️ API format error");
      }

      const normalize = (s) =>
        s.toLowerCase().replace(/[^a-z0-9]/g, "");

      const q = normalize(query);

      const exact = data.users.find(
        (u) => normalize(u.display_name) === q
      );

      const user =
        exact ||
        data.users.find((u) =>
          normalize(u.display_name).includes(q)
        );

      if (!user) {
        return respond(`❌ User *${query}* not found. Try again.`);
      }

      const blocks = [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${user.display_name}*`,
          },
          accessory: {
            type: "image",
            image_url: user.avatar,
            alt_text: user.display_name,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*🍪 Cookies*\n${user.cookies ?? "Hidden"}`,
            },
            {
              type: "mrkdwn",
              text: `*📦 Projects*\n${user.project_ids?.length ?? 0}`,
            },
            {
              type: "mrkdwn",
              text: `*🆔 Slack ID*\n${user.slack_id}`,
            },
          ],
        },
      ];

      await respond({ blocks });
    } catch (err) {
      console.error(err);
      await respond("❌I am not able to get user data");
    }
  });
}
