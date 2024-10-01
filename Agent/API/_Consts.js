const CONSTS = {
    // Firestore 認証情報
    FS: {
        COLLECTION_NAME: 'link_requests',
        PROJECT_ID: `univ-390010`,
        IAM_EMAIL: 'hashed-potato-gas-agent@univ-390010.iam.gserviceaccount.com',
        IAM_KEY: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCnoyYNipJyn1eP\nyAAvbQHBRPSJRwcCf7AHHQMKKRmPLUKlmAxXesqUDZS6CvDxdNGsJJJHDjaUo9SO\nPtLPz7S2RrL+HB4wh/+v+xyo3BB6Kh+N3wpJ3bYV7EHPaB1cok71mjWbHBoot9bf\n8J1l+yECRnINmh467eTbFCvEqfgaI8FMTzhcrJCfMXAnmBmyAM+RyjMrETRGpYoA\nQaI9c67TwNFnEW0moj09nj+6bbeIjqFHvbquw1IdQMIkKCeYhoKG34vP3yeaxAz0\nQ2Iwuo2MZ56l/ubqXn+/1+C4pMftbtlhTu4mtQLBJjyfIIgpLfAmrzWErWl4tY7c\nXXWGLUCXAgMBAAECggEAD9Wu3f+VZsNbY4b6UYCD9mwbhy4Q4PELwRhB9b89HVOi\npH6wx8CfCw4fWtV2vfARcCfCM3kJuc+h38/aXOvbP459ENi6F055Xfej1OV4nvmE\nooOLdr+9F+QJsVw9zca9G6D16FFmvSrkXqHdVEk87HiYBGXm7h0TjYghvEFr4JgR\nuCWhvBbfo+eUawJx6UosDo1YwNxLGftxdWspBMMcVlf7hQbwipC94xBMREcG6e2z\nPNY5Dr6a1Ziq9A+n0dCGEuGI2ne+xciI7kA4G+Il0LB36S878p54VEPv03ehShU/\nIg1uNU0KLETwIVIRwy5K/cnZ2Vye2r4SjfJeE36bSQKBgQDjK6fxXfXR9PckMnwN\numNlsAD1NhsxBzxjHpC8WuZTFJYZA14tdpKjC44vPT0/JfBX5WiikitkqCFJohbn\ncYrt0M/No+wS2wJ9z5LiS2OtTljxiLszQL0mUFf43qhmmjJbeg1c5U8sXkUNta5e\nIu7wt+c80yUEUGgKyo4M4FbjWQKBgQC86V6k+5ZQYkNhlO0yQEUWpf4e6ZDs1+FE\nH9c2+5YkVa5azj/pF8jzlu/7IHEJP8Cfv/AnedbdV4jGnaAHdSXOwUjXtR2adwso\n7QVs2SZsAQHvZeAjKIG8kj8UeeG3lIL4YW7Wwu2PszRezzguz6LhaBae2AN/AlfX\nj9a6OUF1bwKBgGnwuwJqAjCm3/aGgKnaSW5rtRal4+pqaHQFFhRxA8as7A7ALlRf\nXqUgx28qTPy9Eae7+Z8PMaNgcR2otKu8nMCpR6+sCXUFo9TOT76uz85LolkJndua\nDlvmzg/mrnwi3ucgNUkkO1cCo4twNd/6xJmH+hO4mCO557tYmQRSPtMJAoGAXJnU\nj/DXTM3uE55J6xEADMsPVx3MsZxcyuUEvOn0PhlV3yMsxtim42jAeAv9/Leod2ZB\nlUgvH86xuBI6CI3PG5s5VqtsOHRUHxqYRzPmlpij1zLL/M/1UHcrvqDEGRYOYSx5\nhYKFqqQAbt0KwD99qxo3xGNEy3RdlMfoTN6WDLcCgYAWNCitKseyBqgm10u/qnaG\nvkxtqPUpCqwsXbE9T1GstmgS8+sEiGPWlEpGhCzn1jiDbgKBSqaAV1ZrmzwhqRBr\noXjoSABFbCqCEpAD67lMMDXDqyHKgo2Ke6+iIQLnQdBtY9kFP/nC+GVzY/iuasOs\nsDdxoQ4k3rJmBhE+UxOBSw==\n-----END PRIVATE KEY-----\n',
    },
    // Firestore オブジェクトのフィールド名 (doGet取得用)
    CHK_FIELDS: [
        'redirect_uri',
        'scope',
        'type',
        'self_request_auth_value',
        'self_request_auth',
        'requester_id'
    ],
    // 連携の制限時間
    TIME_LIMIT: 1000 * 60 * 10,
    SSID_FOR_LOGGER: '1lL_goIjaRXsdLGojx1KfJH_wQEx0srceVIhFD2wR1k4',
};
