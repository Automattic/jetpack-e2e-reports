async function testRule() {
    return [
        {
            type: 'section',
            text: {
                type: 'mrkdwn',
                'text': 'It works!',
            },
        },
        {
            type: 'context',
            elements: [
                {
                    type: 'plain_text',
                    text: 'Context here. This is a test.',
                    emoji: false,
                }
            ],
        },
        {
            type: 'actions',
            elements: [
                {
                    type: 'button',
                    text: {
                        type: 'plain_text',
                        text: 'Action button',
                    },
                    url: 'https://automattic.github.io/jetpack-e2e-reports/#/charts',
                }
            ],
        },
    ];
}

module.exports = {
    testRule
}
