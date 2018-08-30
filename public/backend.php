<?php
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
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
            if (!$text || !is_string($text) || strlen($text) < 1) {
                send("Text is required with type text.", 400);
            }

            $text = filter_var($text, FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW | FILTER_FLAG_NO_ENCODE_QUOTES);

            $data["type"] = $type;
            $data["text"] = $text;
        } else {
            send("Type is invalid.", 400);
        }

        $data["children"] = [];

        $j = new Json();
        $json = $j->getJson();
        $ids = $j->getIDs();

        if (count($ids) === 0) {
            $id = 1;
        } else {
            $id = max($ids) + 1;
        }

        if ($parent && strlen($parent) > 0) {
            if (!in_array($parent, $ids)) {
                send("Parent ID doesn't exists.", 400);
            }

            $data["parent"] = $parent;
        } else {
            $data["parent"] = null;
        }

        $json[$id] = $data;

        $j->setJson($json);
        $j->write();

        send("Success!", 200);
    } elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
        $j = new Json();
        $json = $j->getFormattedJson();

        send($json, 200);
    }


    send("Bad request.", 400);


    /**
     * データを送って死ぬ
     *
     * @param string $msg
     * @param int    $status
     */
    function send(string $msg, int $status) {
        $json = [
            "message" => $msg,
            "status"  => $status,
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
         *
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
        const FILE_NAME = "../book.json";

        /**
         * File constructor.
         */
        public function __construct() {
            $this->read();
            if (!self::validate($this->getJson())) {
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
         * d3.jsのtreeで使う形式のJSONにして返す
         *
         * @see https://wizardace.com/d3-hierarchy/
         * @return string
         */
        public function getFormattedJson(): string {
            $json = $this->getJson();

            $newJson = [
                "name"     => "invisibleRoot",
                "children" => [],
            ];

            foreach ($json as $id => $datum) {
                $newDatum = [
                    "name"     => $id,
                    "type"     => $datum["type"],
                    "children" => [],
                ];
                if ($newDatum["type"] === "book") {
                    $newDatum["isbn"] = $datum["isbn"];
                } else {
                    $newDatum["text"] = $datum["text"];
                }

                if (!isset($datum["parent"]) || $datum["parent"] === null) {
                    $newJson["children"][] = $newDatum;
                } else {
                    $newDatum["parent"] = $datum["parent"];
                    $newJson = self::recursiveAddChild($newJson, $newDatum);
                }
            }

            return json_encode($newJson);
        }

        /**
         * @param $oya
         * @param $child
         *
         * @return array
         */
        private static function recursiveAddChild($oya, $child): array {
            foreach ($oya["children"] as $k => $ko) {
                if ($ko["name"] === $child["parent"]) {
                    $ko["children"][] = $child;

                    $oya["children"][$k] = $ko;
                    return $oya;
                }
            }
            foreach ($oya["children"] as $k => $ko) {
                $oya["children"][$k] = self::recursiveAddChild($ko, $child);
            }
            return $oya;
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
            $this->fp = fopen(self::FILE_NAME, "c+");

            if (!$this->fp) {
                send("Could not open file.", 500);
            }

            if (!flock($this->fp, LOCK_EX)) {
                send("Could not lock file.", 500);
            }

            $file = fread($this->fp, filesize(self::FILE_NAME));
            $json = json_decode($file,true);
            if ($json === false || $json === null) {
                $this->json = [];
            } else {
                $this->json = $json;
            }
        }

        /**
         * JSONをファイルに書き込む
         */
        public function write() {
            $json = $this->getJson();
            $json = json_encode($json);

            rewind($this->fp);
            if (fwrite($this->fp, $json) === false) {
                send("Could not write file.", 500);
            }
        }

        /**
         * JSONに必要な値が入っているかを確認する
         *
         * @param array $data
         *
         * @return bool
         */
        private static function validate(array $data): bool {
            foreach ($data as $id => $datum) {
                if (isset($datum["type"])) {
                    if ($datum["type"] === "book") {
                        if (isset($datum["isbn"])) {
                            continue;
                        }
                    }
                    if ($datum["type"] === "text") {
                        if (isset($datum["text"])) {
                            continue;
                        }
                    }
                }

                return false;
            }

            return true;
        }

        /**
         * @return array
         */
        public function getIDs() {
            return array_keys($this->getJson());
        }

        /**
         * ファイルロックを外し、ストリームを閉じる
         */
        public function __destruct() {
            if ($this->fp) {
                flock($this->fp, LOCK_UN);
                fclose($this->fp);
            }
        }
    }