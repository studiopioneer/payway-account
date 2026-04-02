import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve, basename} from 'path';
import {copyFileSync, mkdirSync, existsSync, readdirSync, statSync, readFileSync, writeFileSync} from 'fs';

// Ð¤ÑÐ½ÐºÑÐ¸Ñ Ð´Ð»Ñ ÐºÐ¾Ð¿Ð¸ÑÐ¾Ð²Ð°Ð½Ð¸Ñ ÑÐ°Ð¹Ð»Ð¾Ð² Ð¸Ð· Ð¿Ð°Ð¿ÐºÐ¸ `assets` Ð±ÐµÐ· Ð²Ð»Ð¾Ð¶ÐµÐ½Ð½Ð¾Ð¹ ÑÑÑÑÐºÑÑÑÑ
function copyFilesFromFolder(src, dest) {
    if (!existsSync(dest)) {
        mkdirSync(dest, {recursive: true});
    }

    const entries = readdirSync(src);
    for (const entry of entries) {
        const srcPath = resolve(src, entry);
        const destPath = resolve(dest, entry);

        if (statSync(srcPath).isFile()) {
            // ÐÑÐ»Ð¸ ÑÑÐ¾ CSS ÑÐ°Ð¹Ð», Ð·Ð°Ð¼ÐµÐ½ÑÐµÐ¼ ÑÐ¾Ð´ÐµÑÐ¶Ð¸Ð¼Ð¾Ðµ Ð¿ÐµÑÐµÐ´ ÐºÐ¾Ð¿Ð¸ÑÐ¾Ð²Ð°Ð½Ð¸ÐµÐ¼
            if (entry.endsWith('.css')) {
                let cssContent = readFileSync(srcPath, 'utf-8');
                // ÐÐ°Ð¼ÐµÐ½ÑÐµÐ¼ Ð¿ÑÑÐ¸ `/assets/` Ð½Ð° `./`
                cssContent = cssContent.replace(/\/assets\//g, './');
                writeFileSync(destPath, cssContent, 'utf-8');
                console.log(`â CSS ÑÐ°Ð¹Ð» ${srcPath} Ð¾Ð±ÑÐ°Ð±Ð¾ÑÐ°Ð½ Ð¸ ÑÐºÐ¾Ð¿Ð¸ÑÐ¾Ð²Ð°Ð½ Ð² ${destPath}`);
            } else {
                // ÐÑÐ¾ÑÑÐ¾ ÐºÐ¾Ð¿Ð¸ÑÑÐµÐ¼ ÑÐ°Ð¹Ð» Ð±ÐµÐ· Ð¸Ð·Ð¼ÐµÐ½ÐµÐ½Ð¸Ð¹
                copyFileSync(srcPath, destPath);
                console.log(`â Ð¤Ð°Ð¹Ð» ${srcPath} ÑÐºÐ¾Ð¿Ð¸ÑÐ¾Ð²Ð°Ð½ Ð² ${destPath}`);
            }
        }
    }
}

// Ð¤ÑÐ½ÐºÑÐ¸Ñ Ð´Ð»Ñ Ð·Ð°Ð¼ÐµÐ½Ñ Ð¿ÑÑÐµÐ¹ Ðº Ð¿Ð¾Ð´ÐºÐ»ÑÑÐ°ÐµÐ¼ÑÐ¼ ÑÐ°Ð¹Ð»Ð°Ð¼ Ð² `index.html`
function replacePathsInHtml(htmlContent, assetsDir) {
    // ÐÐ¾Ð»ÑÑÐ°ÐµÐ¼ ÑÐ¿Ð¸ÑÐ¾Ðº ÑÐ°Ð¹Ð»Ð¾Ð² Ð¸Ð· Ð´Ð¸ÑÐµÐºÑÐ¾ÑÐ¸Ð¸ assets
    const assetsFiles = existsSync(assetsDir) ? readdirSync(assetsDir) : [];

    // ÐÐ¾Ð¸ÑÐº JavaScript Ð¸ CSS ÑÐ°Ð¹Ð»Ð¾Ð²
    const jsFile = assetsFiles.find(file => file.endsWith('.js'));
    const cssFile = assetsFiles.find(file => file.endsWith('.css'));

    // ÐÐ°Ð¼ÐµÐ½Ð° Ð¿ÑÑÐµÐ¹ Ð² ÑÐ¾Ð´ÐµÑÐ¶Ð¸Ð¼Ð¾Ð¼ HTML
    if (jsFile) {
        htmlContent = htmlContent.replace(
            /<script type="module".*?src=".*?"><\/script>/,
            `<script type="module" crossorigin src="<?php echo PAYWAY_PLUGIN_URL; ?>/assets/${jsFile}"></script>`
        );
    }

    if (cssFile) {
        htmlContent = htmlContent.replace(
            /<link rel="stylesheet".*?href=".*?">/,
            `<link rel="stylesheet" crossorigin href="<?php echo PAYWAY_PLUGIN_URL; ?>/assets/${cssFile}">`
        );
    }

    return htmlContent;
}

// Vite ÐºÐ¾Ð½ÑÐ¸Ð³ÑÑÐ°ÑÐ¸Ñ
export default defineConfig({
    base: './',
    plugins: [
        react(),
        {
            name: 'copy-resources-and-update-php-on-build',
            apply: 'build',
            writeBundle() {
                try {
                    // ÐÐ¸ÑÐµÐºÑÐ¾ÑÐ¸Ð¸ ÑÐµÑÑÑÑÐ¾Ð²
                    const assetsDir = resolve(__dirname, 'dist', 'assets');
                    const distDir = resolve(__dirname, 'dist');
                    const destinationDir = resolve(__dirname, '../wp-content/plugins/payway-personal/assets');
                    const accountPhpPath = resolve(__dirname, '../wp-content/plugins/payway-personal/pages/account.php');

                    // ÐÐ¾Ð¿Ð¸ÑÑÐµÐ¼ ÑÐ°Ð¹Ð»Ñ Ð¸Ð· `dist/assets` Ð² Ð¿Ð°Ð¿ÐºÑ Ð½Ð°Ð·Ð½Ð°ÑÐµÐ½Ð¸Ñ
                    if (existsSync(assetsDir)) {
                        copyFilesFromFolder(assetsDir, destinationDir);
                    } else {
                        console.warn(`â ï¸ ÐÐ°ÑÐ°Ð»Ð¾Ð³ assets Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½: ${assetsDir}`);
                    }

                    // Ð¢Ð°ÐºÐ¶Ðµ Ð¸ÑÐµÐ¼ Ð¾ÑÑÐ°Ð»ÑÐ½ÑÐµ CSS-ÑÐ°Ð¹Ð»Ñ Ð² `dist` Ð¸ ÐºÐ¾Ð¿Ð¸ÑÑÐµÐ¼ Ð±ÐµÐ· Ð¿Ð°Ð¿ÐºÐ¸ `assets`
                    const distFiles = readdirSync(distDir);
                    for (const file of distFiles) {
                        const filePath = resolve(distDir, file);
                        if (statSync(filePath).isFile() && file.endsWith('.css')) {
                            let cssContent = readFileSync(filePath, 'utf-8');
                            // ÐÐ°Ð¼ÐµÐ½ÑÐµÐ¼ Ð¿ÑÑÐ¸ `/assets/` Ð½Ð° `./`
                            cssContent = cssContent.replace(/\/assets\//g, './');
                            const destPath = resolve(destinationDir, file);
                            writeFileSync(destPath, cssContent, 'utf-8');
                            console.log(`â ÐÐ»Ð°Ð²Ð½ÑÐ¹ CSS ÑÐ°Ð¹Ð» ${filePath} Ð¾Ð±ÑÐ°Ð±Ð¾ÑÐ°Ð½ Ð¸ ÑÐºÐ¾Ð¿Ð¸ÑÐ¾Ð²Ð°Ð½ Ð² ${destPath}`);
                        }
                    }

                    // Ð§Ð¸ÑÐ°ÐµÐ¼ ÑÐ¾Ð´ÐµÑÐ¶Ð¸Ð¼Ð¾Ðµ `index.html`
                    const indexHtmlPath = resolve(__dirname, 'dist', 'index.html');
                    if (existsSync(indexHtmlPath)) {
                        const indexHtmlContent = readFileSync(indexHtmlPath, 'utf-8');

                        // ÐÐ·Ð¼ÐµÐ½ÑÐµÐ¼ Ð¿ÑÑÐ¸ Ð¿Ð¾Ð´ÐºÐ»ÑÑÐµÐ½Ð¸Ñ CSS Ð¸ JS Ð²Ð½ÑÑÑÐ¸ HTML
                        const updatedHtmlContent = replacePathsInHtml(indexHtmlContent, destinationDir);

                        // ÐÐ±Ð¾ÑÐ°ÑÐ¸Ð²Ð°ÐµÐ¼ HTML Ð² PHP ÑÐ°Ð±Ð»Ð¾Ð½ Ð¸ ÑÐ¾ÑÑÐ°Ð½ÑÐµÐ¼ Ð² `account.php`
                        const phpTemplate = `<?php
/**
 * Ð¨Ð°Ð±Ð»Ð¾Ð½ ÑÑÑÐ°Ð½Ð¸ÑÑ ÐÐ¸ÑÐ½Ð¾Ð³Ð¾ ÐºÐ°Ð±Ð¸Ð½ÐµÑÐ°
 
 * @author  Alex Kovalev <alex.kovalevv@gmail.com> <Telegram:@alex_kovalevv>
 * @copyright (c) 14.02.2025, CreativeMotion
 */
?>
${updatedHtmlContent}`;

                        writeFileSync(accountPhpPath, phpTemplate, 'utf-8');
                        console.log(`â Ð¾Ð±Ð½Ð¾Ð²Ð»ÑÐ½Ð½ÑÐ¹ ÑÐ°Ð±Ð»Ð¾Ð½ Ð·Ð°Ð¿Ð¸ÑÐ°Ð½ Ð² ${accountPhpPath}`);
                    } else {
                        console.warn(`â ï¸ Ð¤Ð°Ð¹Ð» index.html Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½: ${indexHtmlPath}`);
                    }
                } catch (error) {
                    console.error('ÐÑÐ¸Ð±ÐºÐ° Ð¿ÑÐ¸ ÐºÐ¾Ð¿Ð¸ÑÐ¾Ð²Ð°Ð½Ð¸Ð¸ ÑÐ°Ð¹Ð»Ð¾Ð² Ð¸Ð»Ð¸ Ð¾Ð±Ð½Ð¾Ð²Ð»ÐµÐ½Ð¸Ð¸ ÑÐ°Ð±Ð»Ð¾Ð½Ð° PHP:', error);
                }
            }
        }
    ],
    server: {
        proxy: {
            '/wp-json': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/wp-json/, '/wp-json')
            }
        }
    }
});