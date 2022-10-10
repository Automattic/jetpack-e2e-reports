const { WebClient } = require( '@slack/web-api' );

async function postMessage( token, channel, blocks ) {
    const client = new WebClient( token );
    let response;
            try {
                response = await client.chat.postMessage( {
                    text: 'Jetpack e2e reports alert',
                    blocks,
                    channel,
                    username: "E2E Alerts Bot",
                    icon_emoji: ":robot_face:",
                    unfurl_links: false,
                    unfurl_media: false,
                } );
            } catch ( err ) {
                console.error( err );
            }

    return response;
}

module.exports = {
    postMessage
};
