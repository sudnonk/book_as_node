<?php

    $type = filter_input(INPUT_POST, "type");
    $text = filter_input(INPUT_POST, "text");
    $isbn = filter_input(INPUT_POST, "isbn");
    $parent = filter_input(INPUT_POST, "parent");

    if (!$type) {
        send("Type is required.", 400);
    }

    $data = [];

    if ($type === "book") {
        if (!$isbn) {
            send("ISBN is required with type book.", 400);
        }

        $isbn = ISBN::normalize_isbn($isbn);
        ISBN::check_isbn($isbn);

        $data["type"] = $type;
        $data["ISBN"] = $isbn;
    } elseif ($type === "text") {
        if (!$text) {
            send("Text is required with type text.", 400);
        }

        $text = filter_var($text, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_NO_ENCODE_QUOTES);

        $data["type"] = $type;
        $data["text"] = $text;
    } else {
        send("Type is invalid.", 400);
    }

    $j = new Json();
    $json = $j->getJson();
    $ids = $j->getIDs();
    if (!in_array($parent, $ids)) {
        send("Parent ID doesn't exists.", 400);
    }

    $data["ID"] = max($ids) + 1;

    $json[] = $data;
    $j->setJson($json);
    $j->write();

    send("Success!", 200);


    /**
     * データを送って死ぬ
     *
     * @param string $msg
     * @param int    $status
     */
    function send(string $msg, int $status) {
        $json = [
            "message" => $msg,
            "status"  => $status
        ];
        header("content-type: application/json", true, $status);
        echo json_encode($json);
        die();
    }

    class ISBN {

        /**
         * ISBNを正規化するためにすべて数字/Xがある場合は大文字にする
         *
         * @param string $isbn
         * @return string
         */
        public static function normalize_isbn(string $isbn) {
            $isbn = strtoupper($isbn);

            return preg_replace("/[^\dX]/", '', $isbn);
        }

        /**
         * ISBNが正しいか検証する
         *
         * @param string $isbn
         */
        public static function check_isbn(string $isbn) {
            switch (strlen($isbn)) {
                case 10:
                    self::check_isbn_old($isbn);
                    break;
                case 13:
                    self::check_isbn_new($isbn);
                    break;
                default:
                    send("ISBN is invalid.", 400);
            }
        }

        /**
         * 旧規格のISBNが正しいか検証する
         *
         * @param string $isbn
         */
        private static function check_isbn_old(string $isbn) {
            $strs = str_split($isbn);

            $check_digit = 0;
            for ($i = 0; $i < 9; $i++) {
                $check_digit += (int)$strs[$i] * (10 - $i);
            }

            $check_digit = 11 - $check_digit % 11;

            if ($check_digit === 10) {
                $check_digit = "X";
            }

            if ("$check_digit" === $strs[9]) {

            } else {
                send("ISBN is invalid.", 400);
            }
        }

        /**
         * 現行規格のISBNが正しいか検証する
         *
         * @param string $isbn
         */
        private static function check_isbn_new(string $isbn) {
            $strs = str_split($isbn);

            $check_digit = 0;
            for ($i = 0; $i < 12; $i++) {
                if ($i % 2 === 0) {
                    $check_digit += (int)$strs[$i] * 1;
                } else {
                    $check_digit += (int)$strs[$i] * 3;
                }
            }

            $check_digit = 10 - $check_digit % 10;

            if ($check_digit === (int)$strs[12]) {

            } else {
                send("ISBN is invalid.", 400);
            }
        }
    }

    class Json {
        private $json = [];
        private $fp;
        const FILE_NAME = "./book.json";

        /**
         * File constructor.
         */
        public function __construct() {
            $this->read();
            if (!self::validate($this->json)) {
                send("JSON is not valid.", 500);
            }
        }

        /**
         * JSONのゲッター
         *
         * @return array
         */
        public function getJson(): array {
            return $this->json;
        }

        /**
         * JSONのセッター
         *
         * @param array $json
         */
        public function setJson(array $json) {
            $this->json = $json;
        }

        /**
         * ファイルからJSONを読みだす
         */
        private function read() {
            $this->fp = fopen(self::FILE_NAME, "r+");

            if (!$this->fp) {
                send("Could not open file.", 500);
            }

            if (!flock($this->fp, LOCK_EX)) {
                send("Could not lock file.", 500);
            }

            $file = fread($this->fp, filesize(self::FILE_NAME));
            $this->json = json_decode($file, true);
        }

        /**
         * JSONをファイルに書き込む
         */
        public function write() {
            uasort($this->json, function ($a, $b) {
                if ($a["ID"] === $b["ID"]) {
                    return 0;
                }

                return ($a["ID"] < $b["ID"]) ? -1 : 1;
            });

            $json = json_encode($this->json);

            if (fwrite($this->fp, $json)) {
                send("Could not write file.", 500);
            }
        }

        private static function validate(array $data): bool {
            if (isset($data["ID"]) && isset($data["type"])) {
                if ($data["type"] === "book") {
                    if (isset($data["isbn"])) {
                        return true;
                    }
                }
                if ($data["type"] === "text") {
                    if (isset($data["text"])) {
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * @return array
         */
        public function getIDs() {
            return array_map(function ($datum) {
                return $datum["ID"];
            }, $this->json);
        }

        /**
         * ファイルロックを外し、ストリームを閉じる
         */
        public function __destruct() {
            flock($this->fp, LOCK_UN);
            fclose($this->fp);
        }
    }