#!/usr/bin/env node

/**
 * Supabase Database Setup and Data Migration Script
 * 
 * This script helps you:
 * 1. Test Supabase connection
 * 2. Set up database tables (you'll need to run SQL manually)
 * 3. Migrate existing JSON data to Supabase
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🚀 Supabase Database Setup Script\n');

// Check if credentials are set
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ ERROR: Supabase credentials not found!');
    console.log('\nPlease add these to your .env.local file:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your-project-url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key');
    console.log('\nYou can find these in: Supabase Dashboard > Project Settings > API');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('📡 Testing Supabase connection...');
    try {
        const { data, error } = await supabase.from('videos').select('count').limit(1);
        if (error) {
            if (error.message.includes('relation') || error.message.includes('does not exist')) {
                console.log('⚠️  Tables not yet created. Please run the SQL schema first.');
                return false;
            }
            throw error;
        }
        console.log('✅ Connection successful!');
        return true;
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        return false;
    }
}

async function migrateData() {
    const dataDir = path.join(__dirname, '..', 'data');

    console.log('\n📦 Migrating data from JSON files...\n');

    // Migrate videos
    try {
        const videosFile = path.join(dataDir, 'videos.json');
        if (fs.existsSync(videosFile)) {
            const videos = JSON.parse(fs.readFileSync(videosFile, 'utf8'));
            if (videos.length > 0) {
                console.log(`📹 Migrating ${videos.length} videos...`);

                for (const video of videos) {
                    const { error } = await supabase.from('videos').insert({
                        video_id: video.videoId,
                        url: video.url,
                        title: video.title,
                        description: video.description || '',
                        thumbnail_url: video.thumbnailUrl,
                        added_at: video.addedAt,
                        featured: video.featured || false
                    });

                    if (error && !error.message.includes('duplicate')) {
                        console.error('  ❌ Error migrating video:', video.title, error.message);
                    } else if (!error) {
                        console.log(`  ✅ Migrated: ${video.title.substring(0, 50)}...`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('❌ Error migrating videos:', error.message);
    }

    // Migrate news
    try {
        const newsFile = path.join(dataDir, 'news.json');
        if (fs.existsSync(newsFile)) {
            const news = JSON.parse(fs.readFileSync(newsFile, 'utf8'));
            if (news.length > 0) {
                console.log(`\n📰 Migrating ${news.length} news articles...`);

                for (const article of news) {
                    const { error } = await supabase.from('news').insert({
                        title: article.title,
                        content: article.content,
                        excerpt: article.excerpt,
                        image_url: article.imageUrl,
                        category: article.category,
                        author: article.author,
                        created_at: article.createdAt,
                        updated_at: article.updatedAt,
                        published: article.published,
                        flash_news: article.flashNews || false,
                        featured: article.featured || false,
                        trending: article.trending || false,
                        views: article.views || 0,
                        youtube_url: article.youtubeUrl || '',
                        facebook_url: article.facebookUrl || ''
                    });

                    if (error && !error.message.includes('duplicate')) {
                        console.error('  ❌ Error migrating article:', article.title, error.message);
                    } else if (!error) {
                        console.log(`  ✅ Migrated: ${article.title.substring(0, 50)}...`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('❌ Error migrating news:', error.message);
    }

    // Migrate settings
    try {
        const settingsFile = path.join(dataDir, 'settings.json');
        if (fs.existsSync(settingsFile)) {
            const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));

            console.log(`\n⚙️  Migrating settings...`);

            for (const [key, value] of Object.entries(settings)) {
                const { error } = await supabase.from('settings').upsert({
                    key: key,
                    value: String(value)
                }, { onConflict: 'key' });

                if (error) {
                    console.error(`  ❌ Error migrating setting ${key}:`, error.message);
                } else {
                    console.log(`  ✅ Migrated setting: ${key}`);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error migrating settings:', error.message);
    }

    // Migrate users
    try {
        const usersFile = path.join(dataDir, 'users.json');
        if (fs.existsSync(usersFile)) {
            const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

            console.log(`\n👥 Migrating ${users.length} users...`);

            for (const user of users) {
                const { error } = await supabase.from('users').insert({
                    username: user.username,
                    email: user.email,
                    password: user.password,
                    role: user.role,
                    created_at: user.createdAt
                });

                if (error && !error.message.includes('duplicate')) {
                    console.error(`  ❌ Error migrating user ${user.username}:`, error.message);
                } else if (!error) {
                    console.log(`  ✅ Migrated user: ${user.username}`);
                }
            }
        }
    } catch (error) {
        console.error('❌ Error migrating users:', error.message);
    }

    console.log('\n✨ Migration complete!\n');
}

async function main() {
    const connected = await testConnection();

    if (!connected) {
        console.log('\n📋 Next steps:');
        console.log('1. Go to Supabase Dashboard > SQL Editor');
        console.log('2. Run the SQL from: supabase/schema.sql');
        console.log('3. Run this script again to migrate data');
        return;
    }

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('\n Do you want to migrate data from JSON files to Supabase? (y/n): ', async (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
            await migrateData();
        } else {
            console.log(' Skipping data migration.');
        }
        readline.close();
    });
}

main();
