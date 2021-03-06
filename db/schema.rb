# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140718152447) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "accidents", force: true do |t|
    t.datetime "time"
    t.string   "severity"
    t.string   "vehicle"
    t.float    "lat"
    t.float    "lng"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "description"
    t.string   "extra_label"
  end

  create_table "ips", id: false, force: true do |t|
    t.string   "ip"
    t.integer  "times_visited"
    t.integer  "accidents_submitted"
    t.integer  "accidents_in_last_hour"
    t.datetime "hourly_accidents_timer"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
